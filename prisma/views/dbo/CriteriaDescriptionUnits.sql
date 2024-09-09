CREATE VIEW [dbo].[CriteriaDescriptionUnits] WITH SCHEMABINDING AS
SELECT
  DISTINCT CriteriaDescription,
  Units
FROM
  DBO.ACEExhibitCriteria