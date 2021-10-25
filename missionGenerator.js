function lineIntersection(A, B, C, D, checkAlign = undefined) {
    if (checkAlign === undefined) {
        checkAlign = true;
    }
    let intersect = true;
    let Dn = (B[0] - A[0]) * -(D[1] - C[1]) - (B[1] - A[1]) * -(D[0] - C[0]);
    let Dx = (C[0] - A[0]) * -(D[1] - C[1]) - (C[1] - A[1]) * -(D[0] - C[0]);
    let Dy = (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]);
    let alpha = Dx / Dn;
    let beta = Dy / Dn;
    let wx = (B[0] - A[0]) * alpha;
    let wy = (B[1] - A[1]) * alpha;
    let x = A[0] + wx;
    let y = A[1] + wy;
    if (x === Infinity || y === Infinity) {
        intersect = false;
    }

    if (isNaN(x) || isNaN(y)) {
        intersect = false;
    }
    if (alpha < 0 || alpha > 1 || beta < 0 || beta > 1 && checkAlign) {
        intersect = false;
    }

    return [x, y, intersect];
}


function calculateAngle(A, B) {
    return Math.PI / 2 - Math.atan2(B[1] - A[1], B[0] - A[0]);
}

function calculateAngleBetweenLines(A, B, C) {
    return (Math.atan2(C[1] - B[1], C[0] - B[0]) - Math.atan2(A[1] - B[1], A[0] - B[0]));
}

function convertGPSJSONPolygon(jsonPolygon) {
    const items = [];
    let zeroPoint = [jsonPolygon[0].lat, jsonPolygon[0].long];
    for (let i = 0; i < jsonPolygon.length; i++) {
        items.push([(jsonPolygon[i].lat - zeroPoint[0]) * 111.3 * 1000, (jsonPolygon[i].long - zeroPoint[1]) * (111.3 * Math.cos(jsonPolygon[i].lat * Math.PI / 180)) * 1000]);
    }
    return [items, zeroPoint];
}

function ConvertToGPSRoute(polygon, zeroPoint) {
    let polygonObjectArray = [];

    for (let i = 0; i < polygon.length; i++) {

        const lat = latitudeMeterDistance(polygon[i][0]) + zeroPoint[0];
        const long = longitudeMeterDistance(polygon[i][1], lat) + zeroPoint[1];

        polygonObjectArray.push({lat: lat, long: long, height: 0, alt: 0});
    }
    return polygonObjectArray;
}

function checkPolygonBorderIntersection(polygon, A, B, checkAlign = undefined) {
    if (checkAlign === undefined) {
        checkAlign = true;
    }
    let items = [];
    for (let i = 0; i < polygon.length - 1; i++) {
        const r = lineIntersection(polygon[i], polygon[i + 1], A, B, checkAlign);
        if (r[2] === true) {
            items.push([r[0], r[1], i]);
        }
    }
    const b = lineIntersection(polygon[polygon.length - 1], polygon[0], A, B, checkAlign);
    if (b[2] === true) {
        items.push([b[0], b[1], polygon.length - 1]);
    }
    return items;
}

/**
 * @param distance distance in meters
 * @returns latitude difference
 */
function latitudeMeterDistance(distance) {
    //
    return distance * (0.001 / 111.3);
}

function longitudeMeterDistance(distance, lat) {
    return distance * (0.001 / (111.3 * Math.cos(lat * Math.PI / 180)));
}

function getLine(A, angle, distance) {
    return [A[0] + Math.sin(angle) * distance, A[1] + Math.cos(angle) * distance];
}

function getSurroundingRectangle(polygon) {
    let min = [polygon[0][0], polygon[0][1]];
    let max = [polygon[0][0], polygon[0][1]];
    for (let i = 0; i < polygon.length; i++) {
        if (polygon[i][0] > max[0]) {
            max[0] = polygon[i][0];
        }
        if (polygon[i][1] > max[1]) {
            max[1] = polygon[i][1];
        }
        if (polygon[i][0] < min[0]) {
            min[0] = polygon[i][0];
        }
        if (polygon[i][1] < min[1]) {
            min[1] = polygon[i][1];
        }
    }
    return [[min[0], min[1]], [min[0], max[1]], [max[0], min[1]], [max[0], max[1]]];
}

function fillHorizontalRectangle(rectangle, distance, tolerance) {
    let len = rectangle[2][0] - rectangle[0][0];
    let out = [];
    let b = len / distance;
    console.log("b ", b, "len ", len);
    for (let i = 0; i <= len; i += (len / b)) {
        out.push([[i + rectangle[0][0], rectangle[0][1]], [i + rectangle[0][0], rectangle[1][1]]]);
    }
    return out;
}

function polygonLineCutter(polygon, lines) {
    let out = [];

    for (let ii = 0; ii < lines.length; ii += 1) {
        let k = checkPolygonBorderIntersection(polygon, lines[ii][0], lines[ii][1], true);
        console.log("k ", k, "le ", k.length);
        if (k.length === 2) {
            out.push([k[0], k[1]]);
        }
        if (k.length === 4) {
            out.push([k[0], k[1]]);
            out.push([k[2], k[3]]);
        }
        if (k.length === 6) {
            out.push([k[0], k[1]]);
            out.push([k[2], k[3]]);
            out.push([k[4], k[5]]);
        }
        if (k.length === 8) {
            out.push([k[0], k[1]]);
            out.push([k[2], k[3]]);
            out.push([k[4], k[5]]);
            out.push([k[6], k[7]]);
        }
    }

    return out;
}

function pointDistance(A, B) {
    return Math.sqrt(Math.pow(B[0] - A[0], 2) + Math.pow(B[1] - A[1], 2));
}

function LineShortConnector(lines) {
    let out = [];
    let point = [];
    let minDistance = 1000;
    let tp = lines[0][1];
    for (let i = 0; i < lines.length; i++) {
        minDistance = 1000;
        point = [];
        let tempLine = 0;
        let tempPoint = 0;
        for (let li = 0; li < lines.length; li++) {
            loop1:for (let c = 0; c < 2; c++) {
                if (lines[li][c] === tp) {
                    break;
                }
                for (let z = 0; z < out.length; z++) {
                    if (out[z] === lines[li][c]) {
                        break loop1;
                    }
                }
                let testDistance = pointDistance(lines[li][c], tp);
                if (testDistance < minDistance) {
                    minDistance = testDistance;
                    point = lines[li][c];
                    tempLine = li;
                    tempPoint = c;
                }
            }
        }
        out.push(point);
        if (tempPoint === 0) {
            tempPoint = 1;
        } else if (tempPoint === 1) {
            tempPoint = 0;
        }
        tp = lines[tempLine][tempPoint];
        out.push(tp);

    }
    return out;
}

function lineSorter(lines) {
    let out = [];
    let p = 0;
    let s = 1;
    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < 2; j++) {
            out.push(lines[i][p]);
            p += s;
            if (p > 1) {
                p = 1;
                s = -1;
            }
            if (p < 0) {
                p = 0;
                s = 1;
            }
        }
    }
    return out;
}

function createZigZagRoute(polygon, keepOuts, startposition = undefined, startAngle = undefined) {
    return new Promise((resolve => {


        const DistanceToPolygon = 4;
        polygon = convertGPSJSONPolygon(polygon);
        let zeroPoint = polygon[1];
        polygon = polygon[0];
        console.log(polygon, "zeroPoint: ", zeroPoint);
        if (polygon.length < 3) return;

        if (startposition === undefined) {
            startposition = polygon[0];
        }
        if (startAngle === undefined) {
            startAngle = calculateAngle(polygon[0], polygon[1]);
        }


        let out = (fillHorizontalRectangle(getSurroundingRectangle(polygon), 20, 0));
        polygon = LineShortConnector(polygonLineCutter(polygon, out));
        resolve(ConvertToGPSRoute(polygon, zeroPoint));

    }));
}

const MissionGenerator = {
    createZigZagRoute: createZigZagRoute
};
module.exports = MissionGenerator;
