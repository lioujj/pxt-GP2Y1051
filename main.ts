/**
* Sharp GP2Y1051 PM2.5 感測器的函數
*/

//% weight=0 color=#59c631 icon="\uf0c2" block="PM2.5"
namespace GP2Y1051 {

    let init = false

    //% blockId="setSerial" block="set Sharp GP2Y1051 to %pin"
    //% weight=100 blockGap=20 blockInlineInputs=true
    export function setSerial(pin: SerialPin): void {
        basic.pause(300)
        serial.redirect(
            SerialPin.USB_TX,
            pin,
            BaudRate.BaudRate2400
        )
        init = true
    }


    //% blockId="getData" block="the data of PM2.5(ug/m3)"
    //% weight=90 blockGap=20 blockInlineInputs=true   
    export function getData(): number {
        let myData = 0
        if (init) {
            let myNum = 0
            let myArr: number[] = [0, 0, 0, 0, 0, 0]
            let temp: Buffer
            myNum = serial.readBuffer(1).getNumber(NumberFormat.UInt8BE, 0)
            while (myData == 0) {
                while (myNum != 170) {
                    myNum = serial.readBuffer(1).getNumber(NumberFormat.UInt8BE, 0)
                }
                temp = serial.readBuffer(6)
                for (let i = 0; i < 6; i++) {
                    myArr[i] = temp.getNumber(NumberFormat.UInt8BE, i)
                }
                if (myArr[5] == 255 && (myArr[0] + myArr[1] + myArr[2] + myArr[3]) == myArr[4]) {
                    myData = checkPM25(myArr)
                }
                else {
                    myArr = [0, 0, 0, 0, 0, 0]
                }
            }
        }
        return Math.round(myData)
    }


    function checkPM25(tempArr: number[]): number {
        let vo = ((tempArr[0] * 256 + tempArr[1]) * 2.5) / 1024;
        let c = 0;
        if (vo < 0.045)
            c = vo * 200;
        else if (vo < 0.048)
            c = vo * 400;
        else if (vo < 0.051)
            c = vo * 600;
        else if (vo < 0.054)
            c = vo * 750;
        else if (vo < 0.058)
            c = vo * 900;
        else if (vo < 0.064)
            c = vo * 1000;
        else if (vo < 0.070)
            c = vo * 1250;
        else if (vo < 0.075)
            c = vo * 1400;
        else if (vo < 0.080)
            c = vo * 1700;
        else if (vo < 0.085)
            c = vo * 1800;
        else if (vo < 0.090)
            c = vo * 1900;
        else if (vo < 0.1)
            c = vo * 2000;
        else if (vo < 0.110)
            c = vo * 2200;
        else if (vo > 0.110)
            c = vo * 3000;
        return c
    }
} 