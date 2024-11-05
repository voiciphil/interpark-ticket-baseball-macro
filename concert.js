const refreshButton = document.getElementById('ifrmSeat')
    .contentWindow
    .document
    .getElementsByClassName('fl_r')[0]
    .getElementsByTagName('a')[0];

const selectButton = document.getElementById('ifrmSeat')
    .contentWindow
    .document
    .getElementsByClassName('btnWrap')[0]
    .getElementsByTagName('a')[0];

const isConnectedSeat = (seatInfoList) => {
    if (seatInfoList.length === 0) {
        return false;
    }

    const seatCoulmnIndexList = seatInfoList.map((seatInfo) => parseInt(seatInfo.getAttribute('onclick').split(',')[4].trim().slice(1, -1)));
    const isContinuousIndex = seatCoulmnIndexList.reduce((result, seatColumnIndex, index) => result && (seatColumnIndex === seatCoulmnIndexList[0] + index), true);

    return isContinuousIndex;
};

const select = (groupedSeatList, wantedSeatCount) => {
    if (groupedSeatList.length < wantedSeatCount) {
        return false;
    }

    for (let i = 0; i <= groupedSeatList.length - wantedSeatCount; i++) {
        const slicedSeatList = groupedSeatList.slice(i, i + wantedSeatCount);
        if (isConnectedSeat(slicedSeatList)) {
            slicedSeatList.forEach((seat) => seat.click());
            selectButton.click();
            console.log('선택 완료');
            return true;
        }
    }

    return false;
};

const selectSeat = (wantedSeatCount) => {
    const seatInfoList = Array.from(
        document.getElementById('ifrmSeat')
            .contentWindow
            .document
            .getElementById('ifrmSeatDetail')
            .contentWindow
            .document
            .getElementsByClassName('stySelectSeat')
    );

    const groupedSeatInfo = {};
    seatInfoList.forEach((seatInfo) => {
        const rowGroup = seatInfo.getAttribute('onclick').split(',')[3].trim();

        if (!groupedSeatInfo[rowGroup]) {
            groupedSeatInfo[rowGroup] = [];
        }

        groupedSeatInfo[rowGroup].push(seatInfo);
    });

    let result = false;
    for (const key in groupedSeatInfo) {
        const groupedSeatList = groupedSeatInfo[key];
        groupedSeatList.sort((a, b) => {
            const aSeat = parseInt(a.getAttribute('onclick').split(',')[4].trim().slice(1, -1));
            const bSeat = parseInt(b.getAttribute('onclick').split(',')[4].trim().slice(1, -1));
            return aSeat - bSeat
        });

        const now = new Date();
        console.log(`${now.getHours()}:${('0' + now.getMinutes()).slice(-2)} ${key.split('_')[0]}구역 ${groupedSeatList.length}자리 발생`);

        result = select(groupedSeatList, wantedSeatCount);
        if (result) {
            break;
        }
    }

    return result;
};

const loop = (wantedSeatCount) => {
    const intervalId = setInterval(() => {
        const success = selectSeat(wantedSeatCount);
        if (success) {
            setTimeout(() => alert('좌석 선택 완료'), 2000);
            clearInterval(intervalId);
        }
        refreshButton.click();
    }, 1000);
};
