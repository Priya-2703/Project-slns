import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LoaderAni = () => (
  <div
    style={{
      minHeight: "60vh", // or 100vh for full screen
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    }}
  >
    <DotLottieReact
      src="https://lottie.host/2acd6da2-fd6e-4b3f-a521-e1ceaaafb33e/DRbetX29FO.lottie"
      loop
      autoplay
      style={{ width: 120, height: 120 }} // adjust size as needed
    />
  </div>
);

export default LoaderAni;