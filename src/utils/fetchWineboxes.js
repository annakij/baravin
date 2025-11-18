import api from "../api/axiosInstance";

// Fetch boxes for searchbar in navbar.
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
          // picture-URL based on region + regionname for box
          image: `${process.env.PUBLIC_URL}/images/regions/${region.name}`,
          // link to productpage
          url: `/region/${region.id}`,
        });
      });
    });
  });

  return products;
}
