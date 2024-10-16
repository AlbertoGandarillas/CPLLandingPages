import React from 'react'
import LinkButton from './LinkButton';

export const CCCApplyInstructions = () => {
  return (
    <div className="text-xs bg-blue-100 text-blue-600 w-full corner-none p-4 border-r-4">
      <p className="font-bold">
        Why You Need a CCCApply ID to Inquire About CPL In order for a CPL
      </p>
      <p className="pb-4">
        In order for a CPL counselor to assist you with any questions or
        guidance, you need to be in the process of applying to or already
        admitted to the college. Without a CCCApply ID, they are unable to
        provide guidance for potential CPL credits. Please start your
        application through CCCApply and receive your CCCApply ID. Then return
        here to enter your CCCApply ID and request more CPL information.
      </p>
      <LinkButton
        target="_blank"
        href="https://www.cccapply.org/en/apply"
        variant="default"
      >
        Apply through CCCApply
      </LinkButton>
    </div>
  );
}
