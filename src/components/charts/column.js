import React from 'react';
import { RangeColumn } from '@ant-design/charts';

const DemoRangeColumn = () => {
  const data = [
    {
      management: '技能',
      values: [76, 100],
    },
    {
      management: '应用',
      values: [56, 108],
    },
    {
      management: '用户词典',
      values: [38, 129],
    },
    {
      management: '系统词典',
      values: [58, 155],
    },
    {
      management: '语料库',
      values: [45, 120],
    },
    {
      management: '内容源',
      values: [23, 99],
    },
  ];
  const config = {
    data,
    xField: 'management',
    yField: 'values',
    color: 'l(90) 0:#3e5bdb 1:#b4d9e4',
    columnStyle: {
      fillOpacity: 0.8,
    },
    label: {
      visible: true,
      topStyle: {
        fill: '#3e5bdb',
      },
      bottomStyle: {
        fill: '#b4d9e4',
      },
    },
  };
  return <RangeColumn {...config} />;
};

export default DemoRangeColumn;
