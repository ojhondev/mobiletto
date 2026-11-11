/** Status dos leads do popup (compartilhado entre servidor e cliente). */
export const STATUS_LEAD = {
  novo: { r: "Novo", cor: "bg-[#e7edf4] text-azul" },
  "em-contato": { r: "Em contato", cor: "bg-[#fdf3dc] text-[#8a5a00]" },
  convertido: { r: "Convertido", cor: "bg-[#e6f4ea] text-[#1e6b34]" },
  descartado: { r: "Descartado", cor: "bg-[#f0efeb] text-[#666]" },
} as const;
export type StatusLead = keyof typeof STATUS_LEAD;
