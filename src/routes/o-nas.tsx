import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/info-page";

export const Route = createFileRoute("/o-nas")({
  head: () => ({ meta: [{ title: "O nás — Jungle Circle" }, { name: "description", content: "O sociálním kasinu Jungle Circle." }] }),
  component: () => (
    <InfoPage title="O nás">
      <p>
        Jungle Circle je bezplatné sociální kasino inspirované divokou atmosférou tropické
        džungle — hustým listím, zlatými poklady mezi liánami, tajemnými zvuky pralesa
        a strážci starobylých chrámů.
      </p>
      <p>
        Naším cílem je nabídnout zábavu bez rizika. <strong>Žádné reálné peníze, žádné vklady,
        žádné výhry.</strong> Jen virtuální mince, krásný design a pocit dobrodružství
        z roztočení kola štěstí.
      </p>
      <h2>Pro koho je hra</h2>
      <p>Pro každého ve věku 18+, kdo má rád džunglovou estetiku a chce si zahrát zdarma.</p>
      <h2>Naše hodnoty</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Bezpečnost a transparentnost</li>
        <li>Zábava bez rizika</li>
        <li>Respekt k uživatelům a jejich datům</li>
      </ul>
    </InfoPage>
  ),
});