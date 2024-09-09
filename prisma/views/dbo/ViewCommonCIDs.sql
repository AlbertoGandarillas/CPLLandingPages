WITH CollegeList AS (
  SELECT
    DISTINCT cid.[C-ID],
    col.College
  FROM
    dbo.Articulation AS art
    JOIN dbo.Course_IssuedForm AS C ON art.outline_id = C.outline_id
    JOIN dbo.Stages AS st ON art.ArticulationStage = st.id
    JOIN dbo.LookupColleges AS col ON art.CollegeID = col.CollegeID
    JOIN dbo.MASTER_CID AS cid ON C.CIDNumber = cid.[C-ID]
    AND col.College = cid.Institution
  WHERE
    art.Articulate = 1
    AND art.ArticulationStatus = 1
    AND art.CollegeID NOT IN (63, 120)
    AND st.[Order] = 4
)
SELECT
  cid.[C-ID] AS CID,
  cid.[C-ID_Descriptor] AS CIDDescriptor,
  COUNT_BIG(*) AS Count,
  ISNULL(
    (
      SELECT
        STRING_AGG(College, ', ')
      FROM
        CollegeList
      WHERE
        [C-ID] = cid.[C-ID]
    ),
    ''
  ) AS Colleges
FROM
  dbo.Articulation AS a
  JOIN dbo.Stages AS s ON a.ArticulationStage = s.Id
  JOIN dbo.Course_IssuedForm AS c ON a.outline_id = c.outline_id
  JOIN dbo.LookupColleges AS col ON a.CollegeID = col.CollegeID
  JOIN dbo.MASTER_CID AS cid ON c.CIDNumber = cid.[C-ID]
  AND col.College = cid.Institution
WHERE
  a.articulationstatus = 1
  AND a.Articulate = 1
  AND a.CollegeID NOT IN (63, 120)
  AND s.[Order] = 4
  AND c.status = 0
GROUP BY
  cid.[C-ID],
  cid.[C-ID_Descriptor];