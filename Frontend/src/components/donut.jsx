import React from 'react';
import { ResponsivePie } from "@nivo/pie";
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const ResponsivePieComponent = ({ data }) => (
    <ResponsivePie
        data={data}
        margin={{
            top: 40,
            right: 80,
            bottom: 80,
            left: 80
        }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors={{
            scheme: "nivo"
        }}
        borderWidth={1}
        borderColor={{
            from: "color",
            modifiers: [["darker", 0.2]]
        }}
        radialLabelsSkipAngle={10}
        radialLabelsTextXOffset={6}
        radialLabelsTextColor="#333333"
        radialLabelsLinkOffset={0}
        radialLabelsLinkDiagonalLength={16}
        radialLabelsLinkHorizontalLength={24}
        radialLabelsLinkStrokeWidth={1}
        radialLabelsLinkColor={{
            from: "color"
        }}
        slicesLabelsSkipAngle={10}
        slicesLabelsTextColor="#333333"
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        defs={[
            {
                id: "dots",
                type: "patternDots",
                background: "inherit",
                color: "rgba(255, 255, 255, 0.3)",
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: "lines",
                type: "patternLines",
                background: "inherit",
                color: "rgba(255, 255, 255, 0.3)",
                rotation: -45,
                lineWidth: 6,
                spacing: 9
            },
            {
                id: "squares-pattern",
                type: "patternSquares",
                size: 4,
                padding: 4,
                stagger: true,
                background: "inherit",
                color: "rgba(255, 255, 255, 0.3)"
                
            }
        ]}
        fill={[
            {
                match: {
                    id: "memoryUtil"
                },
                id: "dots"
            },            
            {
                match: {
                    id: "memoryFree"
                },
                id: "lines"
            },          
            {
                match: {
                    id: "cpuFree"
                },
                id : "squares-pattern"
               
            },
            {
                match: {
                    id: "cpuUtil"
                },
                id: "lines"
            }
        ]}
        legends={[
            {
                anchor: "bottom",
                direction: "row",
                translateY: 56,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: "#999",
                symbolSize: 18,
                symbolShape: "circle",
                effects: [
                    {
                        on: "hover",
                        style: {
                            itemTextColor: "#000"
                        }
                    }
                ]
            }
        ]}
    />
);
export default ResponsivePieComponent;
