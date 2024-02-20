import { ControlLabel, SelectTeamMembers } from '@erxes/ui/src';
import SelectBrands from '@erxes/ui/src/brands/containers/SelectBrands';
import SelectBranches from '@erxes/ui/src/team/containers/SelectBranches';
import SelectDepartments from '@erxes/ui/src/team/containers/SelectDepartments';
import React, { useState } from 'react';
import Select from 'react-select-plus';
import { MarginY } from '../../styles';
import DateRange from '../utils/DateRange';

type Props = {
  fieldType: string;
  fieldQuery: string;
  multi?: boolean;
  fieldLabel: string;
  fieldOptions: any[];
  initialValue?: any;
  onChange: (input: any) => void;
  setFilter?: (fieldName: string, value: any) => void;
  startDate?: Date;
  endDate?: Date;
};
const ChartFormField = (props: Props) => {
  const {
    fieldQuery,
    fieldType,
    fieldOptions,
    fieldLabel,
    initialValue,
    multi,
    onChange,
    setFilter,
    startDate,
    endDate,
  } = props;
  const [fieldValue, setFieldValue] = useState(initialValue);

  const onSelect = (e) => {
    if (multi && Array.isArray(e)) {
      const arr = e.map((sel) => sel.value);

      onChange(arr);
      setFieldValue(arr);
      return;
    }

    setFieldValue(e.value);
    onChange(e);
  };

  const onSaveDateRange = (dateRange: any) => {
    const { startDate, endDate } = dateRange;

    if (setFilter) {
      setFilter('startDate', startDate);
      setFilter('endDate', endDate);
    }
  };

  const OnSaveBrands = (brandIds: string[] | string) => {
    if (setFilter) {
      setFilter('brandIds', brandIds);
    }
  };

  switch (fieldQuery) {
    case 'users':
      return (
        <div>
          <ControlLabel>{fieldLabel}</ControlLabel>

          <SelectTeamMembers
            multi={multi}
            name="chartAssignedUserIds"
            label={fieldLabel}
            onSelect={onChange}
            initialValue={fieldValue}
          />
        </div>
      );

    case 'departments':
      return (
        <div>
          <ControlLabel>{fieldLabel}</ControlLabel>

          <SelectDepartments
            multi={multi}
            name="chartAssignedDepartmentIds"
            label={fieldLabel}
            onSelect={onChange}
            initialValue={fieldValue}
          />
        </div>
      );

    case 'branches':
      return (
        <div>
          <ControlLabel>{fieldLabel}</ControlLabel>

          <SelectBranches
            multi={multi}
            name="chartAssignedBranchIds"
            label={fieldLabel}
            onSelect={onChange}
            initialValue={fieldValue}
          />
        </div>
      );

    case 'brands':
      return (
        <div>
          <ControlLabel> {fieldLabel}</ControlLabel>
          <SelectBrands
            multi={true}
            name="selectedBrands"
            label={'Choose brands'}
            onSelect={OnSaveBrands}
            initialValue={fieldValue}
          />
        </div>
      );
    case 'date':
      return (
        <>
          <div>
            <ControlLabel>{fieldLabel}</ControlLabel>
            <Select
              value={fieldValue}
              onChange={onSelect}
              options={fieldOptions}
              placeholder={fieldLabel}
            />
          </div>
          {fieldValue === 'customDate' && (
            <MarginY margin={15}>
              <DateRange
                showTime={false}
                onSaveButton={onSaveDateRange}
                startDate={startDate}
                endDate={endDate}
              />
            </MarginY>
          )}
        </>
      );

    default:
      break;
  }

  switch (fieldType) {
    case 'select':
      return (
        <div>
          <ControlLabel>{fieldLabel}</ControlLabel>
          <Select
            value={fieldValue}
            multi={multi}
            onChange={onSelect}
            options={fieldOptions}
            placeholder={fieldLabel}
          />
        </div>
      );

    default:
      return <></>;
  }
};

export default ChartFormField;
