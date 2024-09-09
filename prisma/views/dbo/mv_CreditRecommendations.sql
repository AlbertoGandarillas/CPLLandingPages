CREATE VIEW [dbo].[mv_CreditRecommendations] WITH SCHEMABINDING AS
SELECT
  DISTINCT AE.Criteria
FROM
  DBO.ACEExhibitCriteria AE