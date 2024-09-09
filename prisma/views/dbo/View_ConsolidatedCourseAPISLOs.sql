SELECT
  DISTINCT [EntityID],
  [EntityTitle],
  [SLO_Header],
  [SLO_Detail],
  [SLO_SortOrder],
  [UpdatedDate]
FROM
  [dbo].[Course_API_SLO]
WHERE
  updateddate > '02-01-2020'
UNION
ALL
SELECT
  [EntityID],
  [EntityTitle],
  [SLO_Header],
  [SLO_Detail],
  [SLO_SortOrder],
  '12-31-2019' AS [UpdatedDate]
FROM
  [dbo].[Course_API_SLO_Local]
WHERE
  entityid + entitytitle NOT IN (
    SELECT
      entityid + entitytitle
    FROM
      Course_API_SLO
  )
UNION
ALL
SELECT
  [EntityID],
  [EntityTitle],
  [SLO_Header],
  [SLO_Detail],
  [SLO_SortOrder],
  '12-31-2019' AS [UpdatedDate]
FROM
  [dbo].[Course_API_SLO_Original]
WHERE
  entityid + entitytitle NOT IN (
    SELECT
      entityid + entitytitle
    FROM
      Course_API_SLO
  )
  AND entityid + entitytitle NOT IN (
    SELECT
      entityid + entitytitle
    FROM
      Course_API_SLO_Local
  );