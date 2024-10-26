import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useEffect, useState } from 'react';

function srcset(image: string, size: number, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${size * rows
      }&fit=crop&auto=format&dpr=2 2x`,
  };
}

export default function QuiltedImageList({ totalItems = 22, totalLargeItems = 4, itemForCols = 4 }) {
  const itemData = [];
  for (let i = 1; i <= totalItems; i++) {
    const tempItem = {
      img: `/salento/${i}.jpeg`,
      title: ' ',
      rows: 1,
      cols: 1,
    };
    itemData.push(tempItem);
    const j = Math.floor(Math.random() * i);
    [itemData[i - 1], itemData[j]] = [itemData[j], itemData[i - 1]];
  }
  let count = 0;
  while (count < totalLargeItems) {
    const y = Math.floor(Math.random() * itemData.length);
    if (itemData[y].rows === 1 && itemData[y].cols === 1) {
      const randomSize = Math.floor(Math.random() * 3);

      switch (randomSize) {
        case 0:
          itemData[y].rows = 2;
          itemData[y].cols = 2;
          break;
        case 1:
          itemData[y].rows = 2;
          itemData[y].cols = 1;
          break;
        case 2:
          itemData[y].rows = 1;
          itemData[y].cols = 2;
          break;
      }
      count++;
    }
  }

  const [dimensions, setDimensions] = useState({
    width: 700,
    height: 700,
  });

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth * 0.8;
      const height = window.innerHeight * 0.8;
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const rowHeight = dimensions.width / itemForCols;

  return (
    <ImageList
      sx={{ width: dimensions.width, height: dimensions.height }}
      variant="quilted"
      cols={itemForCols}
      rowHeight={rowHeight}
    >
      {itemData.map((item) => (
        <ImageListItem key={item.img} cols={item.cols || 1} rows={item.rows || 1}>
          <img
            {...srcset(item.img, rowHeight, item.rows, item.cols)}
            alt={item.title}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}

