import moment from "moment";

export const subtractDate = (date1, date2) => {
    return moment(date1).subtract(moment(date2));
}

export const addDate = (date1, date2) => {
  return moment(date1).add(moment(date2));
};

