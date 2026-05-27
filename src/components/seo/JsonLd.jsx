/**
 * 注入 Schema.org JSON-LD（支援單一物件或陣列）
 */
export default function JsonLd({ data }) {
  if (!data) return null;

  const blocks = Array.isArray(data) ? data : [data];

  return (
    <>
      {blocks.map((block, index) => (
        <script
          key={block["@id"] ?? block["@type"] ?? index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
