package com.root;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.InputStreamReader;
import java.net.URL;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Main {

	private static String Root_Folder = "C://Users//Lenovo//Desktop//";
	private static String Prize_Number_XLS = Root_Folder + "中奖号码.xls";
	private static String Statis_Prize_XLS = Root_Folder + "概率统计.xls";
	private static int Year = 2017;
	private static int Month = 3;
	private static int Day = 29;
	private static int Phase_Account = 664;
	public static int[] Stop_Time = { 2014, 3, 26 };
	public static int[][] Excep_Rule_Date = { { 2016, 9, 28, 2016, 9, 20 }, { 2016, 9, 20, 2016, 9, 14 },
			{ 2016, 7, 6, 2016, 6, 28 }, { 2016, 6, 28, 2016, 6, 22 }, { 2016, 2, 17, 2016, 2, 9 },
			{ 2016, 2, 9, 2016, 2, 3 }, { 2014, 3, 26, 0, 0, 0 } };

	private static String YY = "年";
	private static String MM = "月";
	private static String DD = "日";

	public static int getNumber(String text) {
		String regEx = "[^0-9]";
		Pattern p = Pattern.compile(regEx);
		Matcher m = p.matcher(text);
		int after = Integer.valueOf(m.replaceAll("").trim());
		return after;
	}

	public static void main(String[] args) throws Exception {
		
		try {
			int[] latestDate = latestCatch();
			Year = latestDate[2];
			Month = latestDate[1];
			Day = latestDate[0];
		} catch (java.lang.NumberFormatException e) {
			Year = 2017;
			Month = 3;
			Day = 29;
		}

		BufferedReader reader;
		BufferedWriter writer = new BufferedWriter(new FileWriter(Prize_Number_XLS));
		writer.write("时间\t*\t中\t奖\t号\t码\n");

		ArrayList<String[]> statisPrize = statisPrize();
		String[] prizeProbl = statisPrize.get(1);
		String[] prizeAmount = statisPrize.get(2);

		for (int i = 1; i < 46; i++) {
			prizeAmount[i] = String.valueOf(0);
		}

		DateDIY dateDIY = new DateDIY(Year, Month, Day);
		int phaseAccount = Phase_Account;

		while (phaseAccount > 0 && dateDIY.stopDate(dateDIY)) {
			String[] statisPrizeTemp = new String[46];
			for (int i = 1; i <= 45; i++) {
				statisPrizeTemp[i] = new String("");
			}
			URL url = new URL("http://www.maltco.com/super/results_draws_mar.php?year=" + dateDIY.YY +

					"&month=" + dateDIY.MM + "&day=" + dateDIY.DD);
			reader = new BufferedReader(new InputStreamReader(url.openStream()));
			String line = "";
			String[] prizeNumbers = new String[6];
			prizeNumbers[0] = "" + dateDIY.YY + YY + dateDIY.MM + MM + dateDIY.DD + DD + "\t";
			statisPrizeTemp[0] = "" + dateDIY.YY + YY + dateDIY.MM + MM + dateDIY.DD + DD + "";
			int prizeInt = 1;
			while ((line = reader.readLine()) != null) {
				if (line.indexOf("<table") != -1 && line.indexOf("ergeb") != -1) {
					while (reader.readLine().indexOf("<td") == -1)
						;
					while ((line = reader.readLine()) != null) {
						if (line.indexOf("<td") != -1) {
							int prize = getNumber(reader.readLine());

							prizeAmount[prize] = String.valueOf(Integer.valueOf(prizeAmount[prize]) + 1);
							statisPrizeTemp[prize] = "8888888";

							prizeNumbers[prizeInt] = "" + String.valueOf(prize) + "\t";
							prizeInt++;
						}
						if (line.indexOf("</table>") != -1) {
							statisPrize.add(statisPrizeTemp);
							break;
						}

					}
				}
			}

			prizeNumbers[5] = prizeNumbers[5] + "";
			for (String each : prizeNumbers) {
				writer.write(each);
			}
			writer.write("\n");
			// writer.newLine();

			reader.close();
			dateDIY.changeDate();
			phaseAccount--;
		}

		int allAmount = 0;
		for (int i = 1; i < 46; i++) {
			allAmount = allAmount + Integer.valueOf(prizeAmount[i]);
		}

		for (int i = 1; i < 46; i++) {
			Double persentTemp = Double.valueOf(prizeAmount[i]) / allAmount;
			NumberFormat nf = NumberFormat.getPercentInstance();
			nf.setMinimumFractionDigits(4);// 设置要保留几位小数
			prizeProbl[i] = nf.format(persentTemp);
		}

		writer.close();

		BufferedWriter writerStatis = new BufferedWriter(new FileWriter(Statis_Prize_XLS));
		for (String[] statisPrizeList : statisPrize) {
			for (String statis : statisPrizeList) {
				writerStatis.write(statis + "\t");
			}
			writerStatis.write("\n");
		}

		writerStatis.close();

	}

	private static ArrayList<String[]> statisPrize() {
		ArrayList<String[]> col = new ArrayList<String[]>();

		String[] row1 = new String[46];
		row1[0] = "中奖日期";
		for (int i = 1; i <= 45; i++) {
			row1[i] = String.valueOf(i);
		}
		col.add(row1);

		String[] row2 = new String[46];
		row2[0] = "中奖概率";
		col.add(row2);

		String[] row3 = new String[46];
		row3[0] = "中奖次数";
		col.add(row3);

		return col;
	}

	private static int[] latestCatch() throws Exception {

		URL url = new URL("http://www.maltco.com/super");
		BufferedReader reader = new BufferedReader(new InputStreamReader(url.openStream()));

		int[] latestDate = new int[3];

		String line = "";
		while ((line = reader.readLine()) != null) {
			if ((line.indexOf("<td") != -1) && (line.indexOf("center") != -1) && (line.indexOf("class") != -1)
					&& (line.indexOf("numberDate") != -1)) {
				latestDate[0] = Integer.valueOf(line.substring(line.indexOf("Date") + 6, line.indexOf("Date") + 8));
				latestDate[1] = Integer.valueOf(line.substring(line.indexOf("Date") + 9, line.indexOf("Date") + 11));
				latestDate[2] = Integer.valueOf(line.substring(line.indexOf("Date") + 12, line.indexOf("Date") + 16));

				break;
			}
		}

		return latestDate;
	}
	
}