/*
  Warnings:

  - A unique constraint covering the columns `[groupID,month,year]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Budget_groupID_month_year_key" ON "Budget"("groupID", "month", "year");
