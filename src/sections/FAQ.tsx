import { faqs } from "../siteConfig";
import { AccordionItem } from "../components/AccordionItem";
import { SectionHeading } from "../components/SectionHeading";

export function FAQ() {
  return (
    <section id="preguntas" className="section section--alt">
      <div className="container" style={{ maxWidth: "var(--container-narrow)" }}>
        <SectionHeading
          eyebrow="Preguntas frecuentes"
          title="Lo que suelen preguntarnos"
          description="Si tu duda no está acá, escribinos desde el formulario de contacto."
          align="center"
        />
        <div className="reveal">
          {faqs.map((item, i) => (
            <AccordionItem
              key={i}
              question={item.question}
              answer={item.answer}
              pending={item.pending}
              defaultOpen={i === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
