type AboutTabProps = {
  about: string;
};

export default function AboutTab({ about }: AboutTabProps) {
  return (
    <div className="p-6">
     
      <p className="mt-4 font-inter text-[16px] leading-8 text-muted">
        {about}
      </p>
    </div>
  );
}
