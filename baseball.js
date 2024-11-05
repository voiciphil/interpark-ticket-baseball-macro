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

    const seatCoulmnIndexList = seatInfoList.map((seatInfo) => parseInt(seatInfo.getAttribute('ci')));
    seatCoulmnIndexList.sort();
    const isContinuousIndex = seatCoulmnIndexList.reduce((result, seatColumnIndex, index) => result && (seatColumnIndex === seatCoulmnIndexList[0] + index), true);

    return isContinuousIndex;
};

const isWantedArea = (seatInfoList, wantedAreaList) => {
    if (wantedAreaList.length === 0) {
        return true;
    }

    const selectedArea = seatInfoList[0].getAttribute('rg').split('_')[0];
    return wantedAreaList.includes(selectedArea);
};

const select = (groupedSeatList, wantedSeatCount, wantedAreaList) => {
    if (groupedSeatList.length < wantedSeatCount) {
        return false;
    }

    for (let i = 0; i <= groupedSeatList.length - wantedSeatCount; i++) {
        const slicedSeatList = groupedSeatList.slice(i, i + wantedSeatCount);
        if (isConnectedSeat(slicedSeatList) && isWantedArea(slicedSeatList, wantedAreaList)) {
            slicedSeatList.forEach((seat) => seat.click());
            selectButton.click();
            console.log('선택 완료');
            return true;
        }
    }

    return false;
};

const selectSeat = (wantedSeatCount, wantedAreaList) => {
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
        const rowGroup = seatInfo.getAttribute('rg');

        if (!groupedSeatInfo[rowGroup]) {
            groupedSeatInfo[rowGroup] = [];
        }

        groupedSeatInfo[rowGroup].push(seatInfo);
    });

    let result = false;
    for (const key in groupedSeatInfo) {
        const groupedSeatList = groupedSeatInfo[key];

        const now = new Date();
        console.log(`${now.getHours()}:${('0' + now.getMinutes()).slice(-2)} ${key.split('_')[0]}구역 ${groupedSeatList.length}자리 발생`);

        result = select(groupedSeatList, wantedSeatCount, wantedAreaList);
        if (result) {
            break;
        }
    }

    return result;
};

const loop = (wantedSeatCount, wantedAreaList) => {
    const intervalId = setInterval(() => {
        const success = selectSeat(wantedSeatCount, wantedAreaList);
        if (success) {
            setTimeout(() => alert('좌석 선택 완료'), 2000);
            clearInterval(intervalId);
        }
        refreshButton.click();
    }, 1000);
};
