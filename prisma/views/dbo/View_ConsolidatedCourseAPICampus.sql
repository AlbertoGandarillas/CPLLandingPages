SELECT
  [EntityID],
  [EntityTitle],
  [Campus]
FROM
  [dbo].[Course_API_Campus] AS cac
UNION
ALL
SELECT
  [EntityID],
  [EntityTitle],
  [Campus]
FROM
  [dbo].[Course_API_Campus_Local] AS cacl
WHERE
  cacl.EntityID NOT IN (
    SELECT
      DISTINCT entityID
    FROM
      Course_API_Campus
  );