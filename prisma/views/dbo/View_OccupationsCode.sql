SELECT
  DISTINCT TOP (100) PERCENT aoc.Branch,
  aoc.OccupationId,
  aoc.OccupationSeq,
  aoc.Title
FROM
  dbo.ACEOccupationsCodes AS aoc
  JOIN (
    SELECT
      Branch,
      OccupationId,
      MAX(OccupationSeq) AS LatestOccupationSeq
    FROM
      dbo.ACEOccupationsCodes
    GROUP BY
      Branch,
      OccupationId
  ) AS aoc2 ON aoc.Branch = aoc2.Branch
  AND aoc.OccupationId = aoc2.OccupationId
  AND aoc.OccupationSeq = aoc2.LatestOccupationSeq
ORDER BY
  aoc.Branch,
  aoc.OccupationId;