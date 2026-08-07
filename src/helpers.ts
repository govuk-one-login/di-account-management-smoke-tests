export const validateStatusCode = async (
  expectedStatusCode: number,
  page: {
    goto: (url: string) => Promise<{ status: () => number }>;
    url: () => string;
  },
) => {
  const response = await page.goto(page.url());
  const statusCode = response.status();
  if (statusCode !== expectedStatusCode) {
    throw new Error(
      `Expected status code ${expectedStatusCode} but got ${statusCode}`,
    );
  }
};

export const validateBodyContains = async (
  expectedText: string,
  page: {
    evaluate: (fn: (text: string) => void, arg: string) => Promise<void>;
  },
) => {
  await page.evaluate((expectedText: string) => {
    if (!document.body.innerText.includes(expectedText)) {
      throw new Error(`Page does not contain text '${expectedText}'`);
    }
  }, expectedText);
};

export const validateUrlContains = async (
  expectedSlug: string,
  page: { url: () => string },
) => {
  const url = await page.url();
  if (!url.includes(expectedSlug)) {
    throw new Error(`Url is ${url} and does not contain '${expectedSlug}'`);
  }
};
