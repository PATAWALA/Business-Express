// src/app/api/public/create-order/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateNextOrderRef, generateTasksForOrder } from "@/lib/order-utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      whatsapp,
      items_description,
      quantity,
      sale_price_fcfa,
      expected_delivery,
      notes,
      project_type,
      budget,
    } = body;

    // Validation
    if (
      !whatsapp?.trim() ||
      !items_description?.trim() ||
      !sale_price_fcfa ||
      sale_price_fcfa <= 0
    ) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants ou prix invalide" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const cleanWhatsapp = whatsapp.replace(/\D/g, "");

    // 1. Trouver le client par WhatsApp (3 formats possibles)
    const { data: existingClients } = await admin
      .from("clients")
      .select("id, name, type, whatsapp")
      .or(
        `whatsapp.eq.${whatsapp},whatsapp.eq.+${cleanWhatsapp},phone.eq.${whatsapp},phone.eq.+${cleanWhatsapp}`
      )
      .limit(1);

    if (!existingClients || existingClients.length === 0) {
      return NextResponse.json(
        {
          error:
            "Numéro WhatsApp non reconnu. Contactez d'abord Business Express pour valider votre commande.",
        },
        { status: 403 }
      );
    }

    const client = existingClients[0];

    // 2. Récupérer le taux de change actuel
    const { data: settings } = await admin
      .from("settings")
      .select("exchange_rate_aed_to_fcfa")
      .eq("id", 1)
      .single();

    const exchangeRate = settings?.exchange_rate_aed_to_fcfa ?? 762;

    // 3. Générer la référence
    const order_ref = await generateNextOrderRef(admin);

    // 4. Créer la commande
    const { data: order, error: orderError } = await admin
      .from("orders")
      .insert({
        order_ref,
        client_id: client.id,
        items_description: items_description.trim(),
        quantity: quantity ?? 1,
        purchase_price_aed: 0,
        transport_cost_aed: 0,
        sale_price_fcfa: Math.round(sale_price_fcfa),
        margin_fcfa: Math.round(-sale_price_fcfa * 0), // Marge inconnue tant que le prix d'achat n'est pas rempli
        exchange_rate_aed_to_fcfa: exchangeRate,
        expected_delivery: expected_delivery || null,
        status: "sourcing",
        source: "public",
        source_detail: project_type
          ? `Formulaire commande — ${project_type}${budget ? ` (${budget})` : ""}`
          : `Formulaire commande — ${new Date().toLocaleString("fr-FR")}`,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Erreur création commande:", orderError);
      return NextResponse.json(
        { error: "Erreur lors de la création de la commande" },
        { status: 500 }
      );
    }

    // 5. Promouvoir le client en "client" s'il était prospect
    if (client.type === "prospect") {
      await admin
        .from("clients")
        .update({
          type: "client",
          updated_at: new Date().toISOString(),
        })
        .eq("id", client.id);
    }

    // 6. Générer les tâches automatiques
    const autoTasks = generateTasksForOrder({
      order_ref,
      client_name: client.name,
      items_description: items_description.trim(),
      purchase_price_aed: null,
      status: "sourcing",
    });

    if (autoTasks.length > 0) {
      await admin.from("tasks").insert(autoTasks);
    }

    // 7. Si des notes ont été laissées, les ajouter au client
    if (notes?.trim()) {
      const { data: currentClient } = await admin
        .from("clients")
        .select("notes")
        .eq("id", client.id)
        .single();

      const currentNotes = currentClient?.notes ?? "";
      const newNotes = currentNotes
        ? `${currentNotes}\n---\n${new Date().toLocaleDateString("fr-FR")} (commande ${order_ref}): ${notes.trim()}`
        : `${new Date().toLocaleDateString("fr-FR")} (commande ${order_ref}): ${notes.trim()}`;

      await admin
        .from("clients")
        .update({ notes: newNotes })
        .eq("id", client.id);
    }

    // 8. Récupérer WhatsApp de l'agent pour la confirmation
    const { data: settingsFull } = await admin
      .from("settings")
      .select("company_whatsapp")
      .eq("id", 1)
      .single();

    const agentWhatsapp = (settingsFull?.company_whatsapp || "+243970000000").replace(
      /\D/g,
      ""
    );

    return NextResponse.json({
      success: true,
      order_ref,
      agent_whatsapp: agentWhatsapp,
      client_name: client.name,
    });
  } catch (error) {
    console.error("Erreur API create-order:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}