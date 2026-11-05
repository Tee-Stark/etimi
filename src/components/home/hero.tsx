import { ButtonLink } from "@/components/content/button-link";
import { MetaRail } from "@/components/content/meta-rail";
import { PortraitPlaceholder } from "@/components/content/portrait-placeholder";
import { Container } from "@/components/layout/container";
import { VinculumBar } from "@/components/vinculum/vinculum";

type HeroProps = {
  name: string;
  title: string;
  location: string;
  positioning: string;
  intro: string;
};

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Hero({ name, title, location, positioning, intro }: HeroProps) {
  return (
    <Container className="grid gap-12 pt-14 pb-16 sm:pt-20 sm:pb-20 lg:grid-cols-12 lg:gap-16 lg:pt-28 lg:pb-28">
      <div className="lg:col-span-8">
        <MetaRail
          items={[
            { label: "Role", value: title },
            { label: "Based in", value: location },
          ]}
        />

        <h1 className="mt-6 text-display">{name}</h1>

        <div className="mt-10">
          <VinculumBar className="w-12 h-[3px]" />
          <p className="mt-5 max-w-[24ch] font-serif text-h2 text-balance text-foreground sm:max-w-[28ch]">{positioning}</p>
        </div>

        <p className="mt-8 max-w-measure text-lede text-muted-foreground">{intro}</p>

        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/work">Explore my work</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            Get in touch
          </ButtonLink>
        </div>
      </div>

      <div className="hidden sm:block lg:col-span-4 lg:pt-4">
        <PortraitPlaceholder initials={initialsOf(name)} className="max-w-xs lg:max-w-none" />
      </div>
    </Container>
  );
}
