import type { NextRequest } from "next/server";

import {MercadoPagoConfig, Payment} from "mercadopago";
import {createClient} from "@supabase/supabase-js";

// Agrega credenciales
const mercadopago = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
const supabase = createClient(process.env.NEXT_SUPABASE_URL!, process.env.SECRET_SUPABASE_KEY!)


export async function POST(request: NextRequest) {
    const body = await request.json().then((data) => data as {data: {id: string}});
  
    const payment = await new Payment(mercadopago).get({id: body.data.id});
    
    console.log("payment:", payment);

    console.log("payment.items:", payment.additional_info.items);

    const compra = {
        id: payment.id,
        cantidad: payment.additional_info.items.quantity, // Accede a la cantidad del primer ítem
        nombre: payment.additional_info.payer.first_name, // Accede al nombre del pagador
        apellido: payment.additional_info.payer.last_name, // Accede al apellido del pagador
        //documento: payment.additional_info.payer.identification.number,
    };
    
    console.log("compra:", compra)
  
    const result = await supabase.from("compras").insert(compra);
    
    return Response.json({success: true});
  }