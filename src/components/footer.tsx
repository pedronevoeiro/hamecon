import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-[#1e4c36] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Image src="/logo.svg" alt="Hamecon" width={200} height={56} className="h-14 w-auto brightness-0 invert" />
            <p className="mt-4 text-sm text-white/70">
              Brindes corporativos personalizados com qualidade e agilidade para fortalecer a sua marca.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Navegação</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/#produtos" className="text-sm text-white/70 hover:text-white">
                  Produtos
                </Link>
              </li>
              <li>
                <Link href="/#como-funciona" className="text-sm text-white/70 hover:text-white">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link href="/#sobre" className="text-sm text-white/70 hover:text-white">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/#orcamento" className="text-sm text-white/70 hover:text-white">
                  Solicitar Orçamento
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Contato</h3>
            <ul className="mt-3 space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Mail className="h-4 w-4 shrink-0" />
                gestao@hamecon.com.br
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Phone className="h-4 w-4 shrink-0" />
                (11) 92089-3720
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <MapPin className="h-4 w-4 shrink-0" />
                São Paulo, SP
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/20 pt-8 text-center text-sm text-white/50">
          <p>&copy; {new Date().getFullYear()} Hamecon. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
