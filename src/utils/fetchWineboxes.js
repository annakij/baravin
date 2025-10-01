import api from "../api/axiosInstance";

export async function fetchWineboxes() {
  const res = await api.get("/regions");
  const regions = res.data || [];

  const products = [];

  regions.forEach((region) => {
    region.wineries?.forEach((winery) => {
      winery.winboxes?.forEach((box) => {
        products.push({
          id: box.id,
          name: box.name,
          // bild-URL baserat på regionnamn + box.image
          image: `${process.env.PUBLIC_URL}/images/regions/${region.name}`,
          // länk till produktsida
          url: `/region/${region.id}`,
        });
      });
    });
  });

  return products;
}
