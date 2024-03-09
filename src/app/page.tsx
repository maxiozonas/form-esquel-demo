import { MercadoPagoConfig, Preference } from "mercadopago";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
const supabase = createClient(process.env.NEXT_SUPABASE_URL!, process.env.SECRET_SUPABASE_KEY!)

export default async function Home() {

  const compras = await supabase
    .from("donations")
    .select("*")
    .then(
      ({data}) =>
        data as unknown as Promise<
          {id: number; created_at: number; amount: number; message: string}[]
        >,
    );

  async function compra(formData: FormData) {
    "use server";

    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            id: "compra",
            title: "Compra de Pasaje",
            quantity: Number(formData.get("cantidad")),
            unit_price: 20000,
          },
        ],
        payer: {
          name: formData.get("nombre"),
          surname: formData.get("apellido"),
          email: "user@email.com",
          phone: {
              area_code: "11",
              number: "4444-4444",
          },
          identification: {
              type: "DNI",
              number: formData.get("documento"),
          },
        },
      },
    })

    console.log("Preference:", preference);
 
    redirect(preference.sandbox_init_point!);
  }

  return (
    <section className="dark text-white container m-auto grid min-h-screen grid-rows-[auto,1fr,auto] bg-background px-4 font-sans antialiased">
      <header className="text-xl font-bold leading-[4rem]">form-esquel</header>
      <main className="py-8">
        <section className="grid gap-12">
          <form action={compra} className="m-auto grid max-w-96 gap-8 border p-4">
            <Label className="grid gap-2">
              <span className="text-white">Cantidad de pasajes</span>
              <Select className="text-white" name="cantidad">
                <SelectTrigger className="w-[360px] text-white">
                  <SelectValue className="text-white" placeholder="Eliga la cantidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Cantidad</SelectLabel>
                    <SelectItem name="amount" type="number" value="1">1</SelectItem>
                    <SelectItem name="amount" type="number" value="2">2</SelectItem>
                    <SelectItem name="amount" type="number" value="3">3</SelectItem>
                    <SelectItem name="amount" type="number" value="4">4</SelectItem>
                    <SelectItem name="amount" type="number" value="5">5</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Label>
            <Label className="grid gap-2">
              <span>Nombre</span>
              <Input type="text" name="nombre" required />
            </Label>
            <Label className="grid gap-2">
              <span>Apellido</span>
              <Input type="text" name="apellido" required />
            </Label>
            <Label className="grid gap-2">
              <span>Documento</span>
              <Input type="text" name="documento" required />
            </Label>
            <Button type="submit">Enviar</Button>
          </form>
        </section>
      </main>
      <footer className="text-center leading-[4rem] opacity-70">
        © {new Date().getFullYear()} form-esquel
      </footer>
    </section>
  );
}
