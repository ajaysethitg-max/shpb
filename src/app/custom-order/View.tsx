"use client";

import { list } from "@/lib/defaults";
import CustomOrderForm from "./CustomOrderForm";
import { useSheet } from "@/components/SheetProvider";

export default function CustomOrderView() {
  const { settings: s, deities } = useSheet();
  return (
    <CustomOrderForm
      intro={s.custom_intro}
      note={s.custom_note}
      deities={deities.map((d) => d.name)}
      itemTypes={list(s.custom_item_types)}
      sizes={list(s.default_sizes)}
      fabrics={list(s.custom_fabrics)}
      colours={list(s.custom_colours)}
      steps={list(s.custom_steps)}
      image={s.custom_image}
    />
  );
}
