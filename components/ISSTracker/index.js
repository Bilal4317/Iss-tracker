import { useEffect, useState } from "react";
import Controls from "../Controls/index";
import Map from "../Map/index";
import useSWR from "swr";

const URL = "https://api.wheretheiss.at/v1/satellites/25544";

export default function ISSTracker() {
  const fetcher = async () => {
    const response = await fetch(URL);
    if (!response.ok) {
      const error = new Error("An error occurred while fetching the data.");
      error.status = response.status;
      throw error;
    }
    return response.json();
  };

  const { data, error } = useSWR(URL, fetcher, {
    refreshInterval: 5000,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  if (!data) {
    return <div>Loading.</div>;
  }

  const { longitude, latitude } = data;

  return (
    <main>
      <Map longitude={longitude} latitude={latitude} />
      <Controls longitude={longitude} latitude={latitude} onRefresh={fetcher} />
    </main>
  );
}
