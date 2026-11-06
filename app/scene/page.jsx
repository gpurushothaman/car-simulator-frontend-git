export { metadata } from "./metadata";
//Client components
import CarEnvironment from "@/components/car-environment/CarEnvironment";
//Api
import { getAllCarCustomizeOptions } from "@/services/carCustomizeService";

export default async function Page() {
  try {
    const response = await getAllCarCustomizeOptions();
    return (
      <main style={{ width: "100%", height: "100vh" }}>
        <CarEnvironment optionsData={response?.data?.data} />
      </main>
    );
  } catch (error) {
    console.error("Unexpected Error:", error);
    return (
      <div>
        <h2>Failed to load customization data.</h2>
        <p>Please try again later.</p>
      </div>
    );
  }
}
