function getSquadName() {
  try {
    const squadName = document
      .querySelector('.taskboard-header h1 span')
      ?.innerText.split('-')[0].trim().substring(3);
      
    return squadName;
  } catch (error) {
    return 'NOT FOUND';
  }
}

function getDuration() {
  try {
    const duration = document
      .querySelector('.taskboard-header h1 .date')?.innerText;
      
    return duration;
  } catch (error) {
    return 'NOT FOUND';
  }
}

function getTaskInfo(item) {
  const str = item.querySelector('.card-title').innerText || '';
  const isClosed = !!item.querySelector('.card-tag[title=closed]');
  const isNew = !!item.querySelector('.card-tag[title=new]');

  const regex = /#\d+\[([^\]]+)\]\s*([^\(]+)\s*\(([^)]+)\)/;
  const matches = str.match(regex);

  let type = '';
  let title = '';
  let hours = '';

  if (matches) {
    type = matches[1].trim();
    title = matches[2].trim();
    hours = matches[3].trim().replace('H', '');
  }

  return {
    type,
    title,
    hours,
    isClosed,
    isNew,
  }
}

function getTasks(document) {
  try {
    const tasks = [];
    document.querySelectorAll('.card-inner')
      .forEach((item) => {
        tasks.push(getTaskInfo(item))
      })

    
    return tasks;
  } catch (error) {
    return [];
  }
}

function parseTime(time) {
  const [hours, minutes] = time.split('.').map(Number);
  return hours * 60 + (minutes || 0); // convert to minutes
}

function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}.${mins.toString().padStart(2, '0')}`; // ensure two-digit minute part
}

function sumTimes(...times) {
  const totalMinutes = times.reduce((sum, time) => sum + parseTime(time), 0);
  return formatTime(totalMinutes);
}

function calculatePercentage(hoursSpent, totalHours) {
  const percentage = (hoursSpent / totalHours) * 100;
  return percentage.toFixed(2); // Limitando a duas casas decimais
}

function subtractTimes(time1, time2) {
  const minutes1 = parseTime(time1);
  const minutes2 = parseTime(time2);
  const resultMinutes = Math.max(0, minutes2 - minutes1);
  return formatTime(resultMinutes);
}

function getTotalTasksInfos(tasks) {
  let totalHR = '0.00';
  let totalClosedHR = '0.00';
  let totalClosed = 0;
  let totalNew = 0;
  const totalTypes = {};

  tasks.forEach((task) => {
    totalHR = sumTimes(totalHR, task.hours);
    totalTypes[task.type] = (totalTypes[task.type] || 0) + 1;
    totalClosed += task.isClosed ? 1 : 0;
    totalNew += task.isNew ? 1 : 0;

    if (task.isClosed) {
      totalClosedHR = sumTimes(totalClosedHR, task.hours);
    }
  });

  return {
    totalHR,
    totalTypes,
    totalClosed,
    totalClosedHR,
    totalNew,
  };
}

function getStorys() {
  try {
    const storys = [];
    document
      .querySelectorAll('.taskboard-row')
      .forEach((item) => {
        const tasks = getTasks(item);
        const { totalHR, totalTypes, totalClosed, totalNew, totalClosedHR } = getTotalTasksInfos(tasks);

        const totalPercent = calculatePercentage(parseTime(totalClosedHR), parseTime(totalHR));
        const remainingHours = subtractTimes(totalClosedHR, totalHR);

        // console.log(item.querySelector('.us-title')?.innerText || 'NOT FOUND', tasks);
        storys.push({
          name: item.querySelector('.us-title')?.innerText || 'NOT FOUND',
          tasks,
          totalHR,
          totalTypes,
          totalClosed,
          totalClosedHR,
          totalNew,
          totalPercent,
          remainingHours,
        })
      });

    return storys;
  } catch (error) {
    // console.log(error);
    return [];
  }
}

function sumStorys(storys) {
  let totalHR = '0.00';
  let totalClosedHR = '0.00';
  let totalClosed = 0;
  let totalNew = 0;
  const totalTypes = {};

  storys.forEach((story) => {
    totalHR = sumTimes(totalHR, story.totalHR);
    totalClosedHR = sumTimes(totalClosedHR, story.totalClosedHR);
    totalClosed += story.totalClosed;
    totalNew += story.totalNew;
    Object.keys(story.totalTypes).forEach((type) => {
      totalTypes[type] = (totalTypes[type] || 0) + story.totalTypes[type];
    });
  });

  return { totalHR, totalTypes, totalClosed, totalNew, totalClosedHR };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getData') {
    const squadName = getSquadName();
    const duration = getDuration();
    const storys = getStorys();
    const { totalHR, totalTypes, totalClosed, totalNew, totalClosedHR } = sumStorys(storys);

    const totalPercent = calculatePercentage(parseTime(totalClosedHR), parseTime(totalHR));
    const remainingHours = subtractTimes(totalClosedHR, totalHR);

    // console.log('content', { squadName, duration, storys, totalHR, totalTypes, totalClosed, totalNew, totalClosedHR, totalPercent, remainingHours });

    sendResponse({ squadName, duration, storys, totalHR, totalTypes, totalClosed, totalNew, totalClosedHR, totalPercent, remainingHours });
  }
});
