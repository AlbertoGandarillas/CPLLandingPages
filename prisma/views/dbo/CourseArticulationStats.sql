CREATE VIEW [dbo].[CourseArticulationStats] WITH SCHEMABINDING AS
SELECT
  a.CollegeID,
  a.outline_id,
  r.RoleName,
  count(*) AS Total
FROM
  [DBO].Articulation a
  INNER JOIN [DBO].Stages s ON a.ArticulationStage = s.Id
  INNER JOIN [DBO].ROLES r ON s.RoleId = r.RoleID
GROUP BY
  A.CollegeID,
  a.outline_id,
  r.RoleName