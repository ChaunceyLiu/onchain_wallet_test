import React, { useState, useRef } from "react";
import Logo from "@/assets/logo.png";

interface ImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

// ImageWithFallback组件，接收图片URL和兜底图片URL作为props
function ImageWithFallback(props: ImageWithFallbackProps) {
  const { src, fallbackSrc = Logo, ...rest } = props;
  // 使用useState来保存当前图片的src
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  // 使用useRef来获取对<img>元素的引用
  const imgRef = useRef(null);

  // handleError函数用于处理图片加载错误
  const handleError = () => {
    // 如果兜底图片的URL已提供，则更新当前图片的src为兜底图片
    if (fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
  };

  return <img ref={imgRef} src={currentSrc} onError={handleError} {...rest} />;
}

export default ImageWithFallback;
