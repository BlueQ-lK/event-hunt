import { Snowflake } from '@sapphire/snowflake';

const epoch = new Date('2023-11-14');
const snowflake = new Snowflake(epoch);

export function generateSnowflakeId(): string {
  return snowflake.generate().toString();
}
