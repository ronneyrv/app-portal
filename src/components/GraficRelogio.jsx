import React, { PureComponent } from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const RADIAN = Math.PI / 180;
const cx = 150;
const cy = 100;
const iR = 70;
const oR = 100;

const needle = (value, data, cx, cy, iR, oR, color) => {
  let total = 0;
  data.forEach((v) => {
    total += v.value;
  });
  const ang = 180.0 * (1 - value / total);
  const length = (iR + 2 * oR) / 3;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 2;
  const x0 = cx + 5;
  const y0 = cy + 5;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return [
    <circle key="needle-circle" cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
    <path key="needle-path" d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`} stroke="#none" fill={color} />,
  ];
};

const Relogio = class Example extends PureComponent {
  render() {
    const { plano = 5, real = 3 } = this.props;

    const total = 10;
    const medio = 1;
    const ruim = Math.max(total - plano - medio, 0);

    const data = [
      { name: 'Bom', value: plano, color: '#00ff00' },
      { name: 'Médio', value: medio, color: '#d0d000' },
      { name: 'Ruim', value: ruim, color: '#ff0000' },
    ];
    return (
      <PieChart width={300} height={150}>
        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={data}
          cx={cx}
          cy={cy}
          innerRadius={iR}
          outerRadius={oR}
          fill="#8884d8"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        {needle(real, data, cx, cy, iR, oR, '#0000ff')}
      </PieChart>
    );
  }
}

export default Relogio;