function getRelation(str1, str2) {
    if (str1 === str2) {
      console.warn('Two path are equal!'); // eslint-disable-line
    }
    const arr1 = str1.split('/');
    const arr2 = str2.split('/');
    if (arr2.every((item, index) => item === arr1[index])) {
      return 1;
    } else if (arr1.every((item, index) => item === arr2[index])) {
      return 2;
    }
    return 3;
  }
  function getRenderArr(routes) {
    let renderArr = [];
    renderArr.push(routes[0]);
    for (let i = 1; i < routes.length; i += 1) {
      let isAdd = false;
      // 是否包含
      isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
      // 去重
      renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
      if (isAdd) {
        renderArr.push(routes[i]);
      }
    }
    return renderArr;
  }
  /**
   * Get router routing configuration
   * { path:{name,...param}}=>Array<{name,path ...param}>
   * @param {string} path
   * @param {routerData} routerData
   */
  export function getRoutes(path, routerData) {
    let routes = Object.keys(routerData).filter(
      routePath => routePath.indexOf(path) === 0 && routePath !== path
    );
    // Replace path to '' eg. path='user' /user/name => name
    routes = routes.map(item => item.replace(path, ''));
    // Get the route to be rendered to remove the deep rendering
    const renderArr = getRenderArr(routes);
    // Conversion and stitching parameters
    const renderRoutes = renderArr.map(item => {
      const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
      return {
        exact,
        ...routerData[`${path}${item}`],
        key: `${path}${item}`,
        path: `${path}${item}`,
      };
    });
    return renderRoutes;
  }
  
  /* --------- calendar -------- */
  export const getMonthDates = (year, month) => {
    const m = parseInt(month + 1, 10)
    const d = new Date(year, m, 0)
    return d.getDate()
  }
  const getFirstDayName = (year, month) => {
    const f = new Date(year, month, 1)
    return f.getDay() === 0 ? 7 : f.getDay()
  }
  export function genMonthCalendar(currentDate) {
    const d = new Date(currentDate)
    const year = d.getFullYear()
    const month = d.getMonth()
    const count = getMonthDates(year, month)
    const start = (getFirstDayName(year, month) + 1) % 7
    const result = new Array(start === 0 ? 7 : start).join('0').split('')
    for (let i = 0;i < count;i++) {
        result.push(i + 1)
    }
    var c = [0, 1, 2, 3, 4, 5, 6]
    return result.map((v, i) => ({
      name: v,
      week_name: c[i % 7]
    }))
  }
  
  export function formatYearMonth(date) {
    const month = date.getMonth() + 1
    const monthStr = month > 9 ? month : '0' + month
    return date.getFullYear() + '年' + monthStr + '月'
  }
  
  
  export function getPageLimit(type) {
    if (type === 1) return 10
    if (type === 2) return 5
    if (type === 3) return 8
  }
  
  export function timeFormat(duration) {
    if (!isFinite(duration)) {
      return '00:00'
    }
    let second = Math.ceil(duration % 60)
    let minute = Math.floor(duration / 60)
    second = second > 9 ? second : '0' + second
    minute = minute > 9 ? minute : '0' + minute
    return `${minute}:${second}`
  }
  
  export const ignoreProtocol = url => url && url.replace('https:', '').replace('http:', '')
  
  export const pauseOtherAudio = self => {
    const audios = document.getElementsByTagName('audio');
    [].forEach.call(audios, (el) => {
      self !== el && el.pause()
    })
  }
  
  export const durationTimeFormat = duration => {
    if (typeof duration !== 'number') return "0'00''"
    const second = duration % 60
    const minute = Math.floor(duration / 60)
    return `${minute}'${second > 9 ? second : '0' + second}''`
  }
  