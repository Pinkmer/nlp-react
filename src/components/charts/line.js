import React from 'react';
import { Line } from '@ant-design/charts';

const DemoLine = () => {
  const data = [
    {
      date: '2020/8/1',
      type: '更新',
      value: 4623,
    },
    {
      date: '2020/8/1',
      type: '维护',
      value: 2208,
    },
    {
      date: '2020/8/1',
      type: '测试',
      value: 182,
    },
    {
      date: '2020/8/2',
      type: '更新',
      value: 6145,
    },
    {
      date: '2020/8/2',
      type: '维护',
      value: 2016,
    },
    {
      date: '2020/8/2',
      type: '测试',
      value: 257,
    },
    {
      date: '2020/8/3',
      type: '更新',
      value: 508,
    },
    {
      date: '2020/8/3',
      type: '维护',
      value: 2916,
    },
    {
      date: '2020/8/3',
      type: '测试',
      value: 289,
    },
    {
      date: '2020/8/4',
      type: '更新',
      value: 6268,
    },
    {
      date: '2020/8/4',
      type: '维护',
      value: 4512,
    },
    {
      date: '2020/8/4',
      type: '测试',
      value: 428,
    },
    {
      date: '2020/8/5',
      type: '更新',
      value: 6411,
    },
    {
      date: '2020/8/5',
      type: '维护',
      value: 8281,
    },
    {
      date: '2020/8/5',
      type: '测试',
      value: 619,
    },
    {
      date: '2020/8/6',
      type: '更新',
      value: 1890,
    },
    {
      date: '2020/8/6',
      type: '维护',
      value: 2008,
    },
    {
      date: '2020/8/6',
      type: '测试',
      value: 87,
    },
    {
      date: '2020/8/7',
      type: '更新',
      value: 4251,
    },
    {
      date: '2020/8/7',
      type: '维护',
      value: 1963,
    },
    {
      date: '2020/8/7',
      type: '测试',
      value: 706,
    },
    {
      date: '2020/8/8',
      type: '更新',
      value: 2978,
    },
    {
      date: '2020/8/8',
      type: '维护',
      value: 2367,
    },
    {
      date: '2020/8/8',
      type: '测试',
      value: 387,
    },
    {
      date: '2020/8/9',
      type: '更新',
      value: 3880,
    },
    {
      date: '2020/8/9',
      type: '维护',
      value: 2956,
    },
    {
      date: '2020/8/9',
      type: '测试',
      value: 488,
    },
    {
      date: '2020/8/10',
      type: '更新',
      value: 3606,
    },
    {
      date: '2020/8/10',
      type: '维护',
      value: 678,
    },
    {
      date: '2020/8/10',
      type: '测试',
      value: 507,
    },
    {
      date: '2020/8/11',
      type: '更新',
      value: 4311,
    },
    {
      date: '2020/8/11',
      type: '维护',
      value: 3188,
    },
    {
      date: '2020/8/11',
      type: '测试',
      value: 548,
    },
    {
      date: '2020/8/12',
      type: '更新',
      value: 4116,
    },
    {
      date: '2020/8/12',
      type: '维护',
      value: 3491,
    },
    {
      date: '2020/8/12',
      type: '测试',
      value: 456,
    },
    {
      date: '2020/8/13',
      type: '更新',
      value: 6419,
    },
    {
      date: '2020/8/13',
      type: '维护',
      value: 2852,
    },
    {
      date: '2020/8/13',
      type: '测试',
      value: 689,
    },
    {
      date: '2020/8/14',
      type: '更新',
      value: 1643,
    },
    {
      date: '2020/8/14',
      type: '维护',
      value: 4788,
    },
    {
      date: '2020/8/14',
      type: '测试',
      value: 280,
    },
    {
      date: '2020/8/15',
      type: '更新',
      value: 445,
    },
    {
      date: '2020/8/15',
      type: '维护',
      value: 4319,
    },
    {
      date: '2020/8/15',
      type: '测试',
      value: 176,
    },
  ];
  const config = {
    padding: 'auto',
    forceFit: true,
    data,
    xField: 'date',
    yField: 'value',
    yAxis: {
      label: {
        formatter: v => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, s => `${s},`),
      },
    },
    legend: {
      position: 'right-top',
    },
    seriesField: 'type',
    color: d => (d === '维护' ? '#93D072' : '#2D71E7'),
    responsive: true,
  };
  return <Line {...config} />;
};

export default DemoLine;
