package com.root;

import java.util.ArrayList;

public class DateDIY {
	public int YY;
	public int MM;
	public int DD;

	private DateDIY excepDate;
	private ArrayList<DateDIY> excepDateDIYList;

	public DateDIY(int YY, int MM, int DD) {
		this.YY = YY;
		this.MM = MM;
		this.DD = DD;
	}

	private DateDIY(DateDIY dateDIY, DateDIY excepDate) {
		this.YY = dateDIY.YY;
		this.MM = dateDIY.MM;
		this.DD = dateDIY.DD;

		this.excepDate = new DateDIY(excepDate.YY, excepDate.MM, excepDate.DD);
	}

	private ArrayList<DateDIY> excepRule() {

		this.excepDateDIYList = new ArrayList<DateDIY>();
		
		for(int[] temp_Excep_Rule_Date : Main.Excep_Rule_Date){
			addRule(temp_Excep_Rule_Date[0],temp_Excep_Rule_Date[1],temp_Excep_Rule_Date[2],temp_Excep_Rule_Date[3],temp_Excep_Rule_Date[4],temp_Excep_Rule_Date[5]);
		}

		return excepDateDIYList;
	}

	public boolean stopDate(DateDIY dateDIY) {
		DateDIY dateDIYTemp = new DateDIY(Main.Stop_Time[0], Main.Stop_Time[1], Main.Stop_Time[2]);
		if (dateDIY.YY == dateDIYTemp.YY && dateDIY.MM == dateDIYTemp.MM && dateDIY.DD == dateDIYTemp.DD) {
			return false;
		} else {
			return true;
		}
	}

	private DateDIY addRule(int YY, int MM, int DD, int execepYY, int execepMM, int execepDD) {

		excepDateDIYList.add(new DateDIY(new DateDIY(YY, MM, DD), new DateDIY(execepYY, execepMM, execepDD)));
		return this;
	}

	private boolean exception() {
		ArrayList<DateDIY> excepDateDIYList = excepRule();

		for (DateDIY excepDateDIYBuff : excepDateDIYList) {
			if (this.YY == excepDateDIYBuff.YY && this.MM == excepDateDIYBuff.MM && this.DD == excepDateDIYBuff.DD) {
				this.YY = excepDateDIYBuff.excepDate.YY;
				this.MM = excepDateDIYBuff.excepDate.MM;
				this.DD = excepDateDIYBuff.excepDate.DD;
				return false;
			}
		}

		return true;
	}

	public void changeDate() {
		if (exception()) {
			if (this.DD - 7 < 1) {
				if (this.MM - 1 < 1) {
					this.DD = this.DD + 31 - 7;
					this.MM = 12;
					this.YY = this.YY - 1;
				} else {
					this.MM = this.MM - 1;
					if (this.MM == 1 || this.MM == 3 || this.MM == 5 || this.MM == 7 || this.MM == 8 || this.MM == 10) {
						this.DD = this.DD + 31 - 7;
					} else if (this.MM == 4 || this.MM == 6 || this.MM == 9 || this.MM == 11) {
						this.DD = this.DD + 30 - 7;
					} else if ((this.YY % 4 == 0) && this.MM == 2) {
						this.DD = this.DD + 29 - 7;
					} else {
						this.DD = this.DD + 28 - 7;
					}
				}
			} else {
				this.DD = this.DD - 7;
			}
		}
	}
}
