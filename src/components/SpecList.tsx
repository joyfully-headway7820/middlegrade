import React from "react";
import dataJson from "../data.json";
import { IDataElement } from "../App";

interface IProps {
	arrDate: string;
	setData: (data: IDataElement[]) => void;
	activeList: boolean;
	setActiveList: (activeList: boolean) => void;
}

export default function SpecList({
	arrDate,
	setData,
	activeList,
	setActiveList,
}: IProps) {
	const [activeSpec, setActiveSpec] = React.useState<string>("Все предметы");
	const arr: string[] = dataJson
		.map((i) => i.spec_name)
		.filter((_, pos) => dataJson[pos].date_visit > arrDate);
	const specList: string[] = arr
		.filter((item: string, pos: number) => arr.indexOf(item) === pos)
		.sort();
	specList.forEach((element, pos) => {
		if (specList.includes(element) && specList.includes(`${element} РПО`)) {
			specList.splice(specList.indexOf(`${element} РПО`), 1);
		}
		if (element.includes(" РПО")) {
			specList[pos] = element.replace(" РПО", "");
		}
		if (element.includes(" ГД")) {
			specList[pos] = element.replace(" ГД", "");
		}
	});

	return (
		<div className='center'>
			<div>
				<div
					className='active_spec'
					onClick={(event) => {
						event.stopPropagation();
						setActiveList(!activeList);
					}}
				>
					{activeSpec}
				</div>
				{activeList && (
					<ul className='spec_list'>
						<li
							className='spec_list__item'
							onClick={() => {
								setData(dataJson);
								setActiveSpec("Все предметы");
								setActiveList(false);
							}}
						>
							Все предметы
						</li>
						{specList.map((spec) => (
							<li
								className='spec_list__item'
								key={spec}
								onClick={() => {
									setData(
										dataJson.filter(
											(element) =>
												element.spec_name === spec ||
												element.spec_name === `${spec} РПО` ||
												element.spec_name === `${spec} ГД`
										)
									);
									setActiveSpec(spec);
									setActiveList(false);
								}}
							>
								{spec}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
