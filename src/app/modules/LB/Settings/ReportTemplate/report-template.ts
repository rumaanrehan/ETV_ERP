export interface ReportTemplateMaster {
  ReportTemplateID: number | null;
  ReportTemplateCode: string | null;
  ServiceCategoryID: number;
  TestID: number | null;
  ReportTemplateName: string | null;
  TemplateContent: string | null;
  TemplateImpression: string | null;
}
export interface ReportTemplateMasterList {
  RowID: number;
  ReportTemplateID: number;
  ReportTemplateCode: string;
  ReportTemplateName: string;
  ServiceCategoryName: string;
  ServiceName: string;
  CreatedBy: string;
  ActiveStatus: any;
}

export interface LableMaster {
  Label: string | null;
}


//public class ReportTemplateMasterValidator : AbstractValidator<ReportTemplateMaster>
//{
//        public ReportTemplateMasterValidator()
//  {
//    RuleFor(x => x.ActionType)
//      .NotEmpty().WithMessage("Action Type is Required.");

//    RuleFor(x => x.ReportTemplateID)
//      .NotEmpty().WithMessage("Report Template ID is Required.")
//      .When(x => x.ActionType != "Create");

//    RuleFor(x => x.ServiceCategoryID)
//      .NotEmpty().WithMessage("Please Select Category.")
//      .When(x => (x.ActionType == "Create" || x.ActionType == "Update"));

//    RuleFor(x => x.TestID)
//      .NotEmpty().WithMessage("Please Select Test.")
//      .When(x => (x.ActionType == "Create" || x.ActionType == "Update"));

//    RuleFor(x => x.ReportTemplateName)
//      .NotEmpty().WithMessage("Report Template Name is Required.")
//      .MaximumLength(50).WithMessage("Report Template Name cannot be longer than 50 characters.")
//      .When(x => (x.ActionType == "Create" || x.ActionType == "Update"));

//    RuleFor(x => x.ReasonToUpdate)
//      .NotEmpty().WithMessage("Reason to update is Required.")
//      .When(x => x.ActionType != "Create");
//  }
//}
