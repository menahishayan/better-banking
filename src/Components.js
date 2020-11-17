import React, { Fragment } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import './Components.css'

export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


export const Overlay = props => (
    <Fragment>
        <div className="overlay" onClick={props.bgClick} style={{ opacity: (props.visible === true ? 1 : 0), display: (props.visible === true ? 'block' : 'none') }}></div>
        <div className="overlay-container" style={{ display: (props.visible === true ? 'block' : 'none') }}>
            {props.children}
        </div>
    </Fragment>
)

export const Chart = props => {
    const chartLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.25;
        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {props.chartData[index].name}
            </text>
        );
    };

    const chartTooltip = ({ active, payload, label }) => {
        if (active) {
            return (
                <div className="chart-tooltip">
                    <b>{`${payload[0].name}`}</b><br />
                    {` \u20B9${payload[0].value.toFixed(2)}`}
                </div>
            );
        }

        return null;
    };
    return (
        <PieChart width={300} height={300} className="chart">
            <Pie data={props.chartData} labelLine={false} label={chartLabel} outerRadius={150} innerRadius={110} fill="#8884d8" dataKey="value" >
                {props.chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip content={chartTooltip} />
            {/* <Legend /> */}
        </PieChart>
    )
}

export const Card = props => {
    const maskedCardNo = (number) => {
        return number.substring(0, 4) + number.substring(4, number.length - 2).replace(/\d/g, "\u2022") + number.substring(number.length - 2);
    }
    return (
        <div className="card zoom-l">
            <div className="card-type">
                {
                    props.card.provider === 'mastercard' ?
                        <img src="mc-icon.svg" alt="mc" height="24px" />
                        :
                        <img src="visa-icon.svg" alt="visa" height="18px" />
                }
            </div>
            <div className="card-no">{maskedCardNo(props.card.number)}</div>
        </div>
    )
}

export const PersonAvatar = props => (
    <div style={{ display: 'inline', position: props.inline ? 'relative' : 'static', left: '-3%' }}>
        <div className="person zoom-m" onClick={props.onClick} style={[{ display: props.inline ? 'inline-block' : 'block' }, props.style]}>
            {
                props.person.img ?
                    <div>
                        <img src={props.person.img} alt={props.person.shortname} className="person-pic" />
                    </div> :
                    <div className="person-pic"></div>
            }
            {!props.inline && <span className="person-name">{props.person.shortname}</span>}
        </div>
        {
            props.inline &&
            <div style={{ display: 'inline-block', textAlign: 'left', marginLeft: '2%', position: 'relative', top: 12 }}>
                <span style={{ fontSize: 22, fontWeight: 600, position: 'relative', top: 8 }}>{props.person.name}</span>
                <small style={{ position: 'relative', color: 'darkgrey' }}><br />{props.person.accno}</small>
            </div>
        }
    </div>
)