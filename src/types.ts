export type Brand<K, T> = K & { __brand: T };

/**
 * Minutes since start the UTC start of the week
 * Integer in range [0, 10080]
 * A number representing this weekly time, as the number of minutes since the start of the week
 * NB: we always assume 24 hour days, and 60 minute hours given we only support UTC
 * */
export type WeeklyTime = Brand<number, 'WeeklyTime'>;

/**
 * A left-closed interval between two times, i.e. >= first time, < second time
 */
export type Interval = [WeeklyTime, WeeklyTime];
