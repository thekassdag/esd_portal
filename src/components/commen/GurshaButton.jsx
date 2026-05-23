import { SupportButton } from "@gurshaplus/sdk";

export default function GurshaButton({ label, creator,className=null }) {
    return (
        <SupportButton
            label={label}
            creator={creator}
            variant="popup"
            emoji=""
            className={`${className} talent-card text-xs font-semibold px-5 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-md group overflow-hidden`}
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='16' y='16' font-family='serif' font-size='10' fill='white' fill-opacity='0.25' text-anchor='middle' dominant-baseline='middle' transform='rotate(-25)'%3E$%3C/text%3E%3C/svg%3E"), 
          linear-gradient(135deg, hsl(var(--ikb-500)), hsl(var(--ikb-700)))`,
                backgroundSize: "28px 28px, 28px,28px",
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
                border: "1px solid hsla(var(--ikb-400) / 0.5)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                boxShadow: "0 4px 15px -3px hsla(var(--ikb-500) / 0.3), 0 4px 6px -4px hsla(var(--ikb-500) / 0.2)",
            }}
        />
    );
}