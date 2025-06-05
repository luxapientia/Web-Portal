import Image from "next/image";
import { Box, BoxProps } from "@mui/material";
import Link from "next/link";

interface LogoProps extends BoxProps {
  showText?: boolean;
  size?: "small" | "medium" | "large";
}

export default function Logo({
  size = "medium",
  ...boxProps
}: LogoProps) {
  // Size mappings
  const sizes = {
    small: {
      container: { width: 120, height: 60 },
      backCoin: { width: 60, height: 60 },
      frontCoin: { width: 80, height: 80 },
      fontSize: "1.25rem",
    },
    medium: {
      container: { width: 160, height: 80 },
      backCoin: { width: 80, height: 80 },
      frontCoin: { width: 100, height: 100 },
      fontSize: "1.5rem",
    },
    large: {
      container: { width: 200, height: 160 },
      backCoin: { width: 130, height: 130 },
      frontCoin: { width: 170, height: 170 },
      fontSize: "2.5rem",
    },
  };

  const currentSize = sizes[size];

  return (
    <Box
      component={Link}
      href="/"
      sx={{
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
        color: "inherit",
        ...boxProps.sx,
      }}
      {...boxProps}
    >
      <Box
        sx={{
          width: currentSize.container.width,
          height: currentSize.container.height,
          position: "relative",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* Back Coin (Left) */}
        <Box
          sx={{
            position: "absolute",
            width: currentSize.backCoin.width,
            height: currentSize.backCoin.height,
            left: "15%",
            top: -10,
            zIndex: 1,
          }}
        >
          <Image
            src="/images/coin.png"
            alt="Double Bubble Coin Back"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </Box>
        {/* Front Coin (Right) */}
        <Box
          sx={{
            position: "absolute",
            width: currentSize.frontCoin.width,
            height: currentSize.frontCoin.height,
            right: "15%",
            top: -5,
            zIndex: 2,
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
          }}
        >
          <Image
            src="/images/coin.png"
            alt="Double Bubble Coin Front"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </Box>
      </Box>
    </Box>
  );
}
