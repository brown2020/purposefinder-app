// SVGOverlay.tsx
import React from "react";

type SVGOverlayProps = {
  profileName: string;
  version: string;
  message: string;
  updatedAt: Date | null;
};

const SVGOverlay: React.FC<SVGOverlayProps> = ({
  profileName,
  version,
  message,
  updatedAt,
}) => {
  return (
    <div className="absolute top-0 z-40 flex flex-col items-center justify-center w-full h-full text-white">
      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <foreignObject x="0" y="0" width="100%" height="100%">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                width: "75%",
                justifyContent: "start",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                padding: "12px 14px",
                borderRadius: "6px",
              }}
            >
              <div style={{ alignSelf: "flex-start", fontSize: "18px" }}>
                {`${profileName}'s ${version.toUpperCase()}:`}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  height: "100%",
                  width: "100%",
                  fontSize: "24px",
                  lineHeight: "28px",
                  fontWeight: "600",
                }}
              >
                {message}
              </div>
              <div style={{ alignSelf: "flex-end", fontSize: "12px" }}>
                {updatedAt
                  ? updatedAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                    })
                  : "No date"}
              </div>
            </div>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
};

export default SVGOverlay;
