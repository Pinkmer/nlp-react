import React from 'react';
import { Donut } from '@ant-design/charts';

const DemoDonut = () => {
  const data = [
    {
      type: '技能',
      value: 57,
    },
    {
      type: '应用',
      value: 25,
    },
    {
      type: '用户词典',
      value: 18,
    },
    {
      type: '系统词典',
      value: 15,
    },
    {
      type: '语料',
      value: 10,
    },
    {
      type: '内容源',
      value: 5,
    },
  ];
  const config = {
    forceFit: true,
    radius: 0.8,
    padding: 'auto',
    data,
    angleField: 'value',
    colorField: 'type',
    label: {
      visible: false
    },
  };
  return <Donut {...config} />;
};

export default DemoDonut;
