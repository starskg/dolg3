import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";

// ✅ API калитини .env'дан олиш тавсия қилинади
builder.init("dc175563121d40a996f44c6e88a879ce");

export default function BuilderPage() {
  const isPreviewingInBuilder = useIsPreviewing();
  const [notFound, setNotFound] = useState(false);
  const [content, setContent] = useState(null);
  const location = useLocation(); // ✅ Router'дан URL олиш

  useEffect(() => {
    async function fetchContent() {
      const content = await builder
        .get("page", { url: location.pathname }) // ✅ useLocation() орқали URL олиш
        .toPromise();
      setContent(content);
      setNotFound(!content);

      if (content?.data.title) {
        document.title = content.data.title;
      }
    }
    fetchContent();
  }, [location.pathname]); // ✅ URL ўзгарганда қайта юкланади

  // ✅ Агар саҳифа топилмаса, 404 хабарини чиқариш
  if (notFound && !isPreviewingInBuilder) {
    return <h2>404 - Страница не найдена </h2>;
  }

  // ✅ Агар контент юкланмаган бўлса, юкланиш хабарини чиқариш
  if (!content) {
    return <h2>Загрузка контента...</h2>;
  }

  // ✅ Builder.io'дан олинган контентни чиқариш
  return <BuilderComponent model="page" content={content} />;
}
