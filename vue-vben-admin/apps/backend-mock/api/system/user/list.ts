import { faker } from '@faker-js/faker';
import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { MOCK_ROLE_LIST } from '~/utils/mock-data';
import { unAuthorizedResponse, usePageResponseSuccess } from '~/utils/response';

const formatterCN = new Intl.DateTimeFormat('zh-CN', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

//  生产 mock 数据
function generateMockDataList(count: number) {
  const dataList = [];

  for (let i = 0; i < count; i++) {
    const dataItem: Record<string, any> = {
      id: faker.string.uuid(),
      userName: faker.finance.accountNumber(),
      realName: faker.internet.username(),
      status: faker.helpers.arrayElement([0, 1]),
      createTime: formatterCN.format(
        faker.date.between({ from: '2022-01-01', to: '2025-01-01' }),
      ),
      roles: faker.helpers.arrayElements(MOCK_ROLE_LIST),
    };

    dataList.push(dataItem);
  }

  return dataList;
}

const mockData = generateMockDataList(10);

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const {
    page = 1,
    pageSize = 20,
    userName,
    id,
    realName,
    status,
  } = getQuery(event);
  let listData = structuredClone(mockData);
  if (userName) {
    listData = listData.filter((item) =>
      item.userName.toLowerCase().includes(String(userName).toLowerCase()),
    );
  }
  if (realName) {
    listData = listData.filter((item) =>
      item.realName.toLowerCase().includes(String(realName).toLowerCase()),
    );
  }
  if (id) {
    listData = listData.filter((item) =>
      item.id.toLowerCase().includes(String(id).toLowerCase()),
    );
  }
  if (['0', '1'].includes(status as string)) {
    listData = listData.filter((item) => item.status === Number(status));
  }
  return usePageResponseSuccess(page as string, pageSize as string, listData);
});
